package ponto.agro.desenvolvimento.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ItemVendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Cliente;
import ponto.agro.desenvolvimento.models.ItemVenda;
import ponto.agro.desenvolvimento.models.MovimentacaoEstoque;
import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.Venda;
import ponto.agro.desenvolvimento.models.enums.StatusVenda;
import ponto.agro.desenvolvimento.models.enums.TipoMovimentacaoEstoque;
import ponto.agro.desenvolvimento.repositories.ClienteRepository;
import ponto.agro.desenvolvimento.repositories.MovimentacaoEstoqueRepository;
import ponto.agro.desenvolvimento.repositories.OperadorRepository;
import ponto.agro.desenvolvimento.repositories.ProdutoRepository;
import ponto.agro.desenvolvimento.repositories.VendaRepository;
import ponto.agro.desenvolvimento.security.OperadorAutenticado;

@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final ClienteRepository clienteRepository;
    private final OperadorRepository operadorRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public VendaService(VendaRepository vendaRepository, ProdutoRepository produtoRepository,
                         ClienteRepository clienteRepository, OperadorRepository operadorRepository,
                         MovimentacaoEstoqueRepository movimentacaoEstoqueRepository) {
        this.vendaRepository = vendaRepository;
        this.produtoRepository = produtoRepository;
        this.clienteRepository = clienteRepository;
        this.operadorRepository = operadorRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
    }

    private void registrarMovimentacao(Produto produto, TipoMovimentacaoEstoque tipo, Integer quantidade, String observacao, Long vendaId, Operador operador) {
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setObservacao(observacao);
        movimentacao.setVendaId(vendaId);
        movimentacao.setOperador(operador);
        movimentacaoEstoqueRepository.save(movimentacao);
    }

    @Transactional
    public VendaResponseDTO salvar(VendaRequestDTO dto) {
        Venda venda = new Venda();
        venda.setStatus(StatusVenda.FINALIZADA);
        venda.setFormaPagamento(dto.formaPagamento());
        venda.setValorRecebido(dto.valorRecebido());

        if (dto.clienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
            venda.setCliente(cliente);
        }

        var operadorLogado = OperadorAutenticado.obter();
        Operador atendente = operadorLogado != null ? operadorRepository.findById(operadorLogado.id()).orElse(null) : null;
        venda.setAtendente(atendente);

        for (ItemVendaRequestDTO item : dto.itens()) {
            Produto produto = produtoRepository.findById(item.produtoId())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("O produto com ID informado não foi encontrado"));

            if (produto.getQuantidade() < item.quantidade()) {
                throw new RegraDeNegocioException("Estoque insuficiente para o produto");
            }

            produto.setQuantidade(produto.getQuantidade() - item.quantidade());

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(item.quantidade());
            itemVenda.setPrecoUnitario(produto.getPreco());
            itemVenda.setVenda(venda);

            venda.getItens().add(itemVenda);
        }

        BigDecimal subtotal = venda.getItens().stream()
                .map(ItemVenda::calcularSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal desconto = dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO;
        BigDecimal acrescimo = dto.acrescimo() != null ? dto.acrescimo() : BigDecimal.ZERO;
        if (desconto.compareTo(subtotal.add(acrescimo)) > 0) {
            throw new RegraDeNegocioException("O desconto não pode ser maior que o subtotal da venda");
        }

        venda.setDesconto(desconto);
        venda.setAcrescimo(acrescimo);
        venda.setValorTotal(subtotal.add(acrescimo).subtract(desconto));

        if (dto.valorRecebido() != null) {
            venda.setTroco(dto.valorRecebido().subtract(venda.getValorTotal()));
        }

        Venda vendaSalva = vendaRepository.save(venda);

        for (ItemVenda item : vendaSalva.getItens()) {
            registrarMovimentacao(item.getProduto(), TipoMovimentacaoEstoque.SAIDA, item.getQuantidade(),
                    "Saída por venda", vendaSalva.getId(), atendente);
        }

        return new VendaResponseDTO(vendaSalva);
    }

    @Transactional(readOnly = true)
    public VendaResponseDTO buscarPorIdDto(Long id) {
        return new VendaResponseDTO(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public Venda buscarPorId(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("A venda com ID informado não foi encontrada"));
    }

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> listar(LocalDate dataInicio, LocalDate dataFim, Long clienteId, Long atendenteId) {
        Specification<Venda> spec = (root, query, cb) -> cb.conjunction();

        if (dataInicio != null) {
            LocalDateTime inicio = dataInicio.atStartOfDay();
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dataVenda"), inicio));
        }
        if (dataFim != null) {
            LocalDateTime fim = LocalDateTime.of(dataFim, LocalTime.MAX);
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("dataVenda"), fim));
        }
        if (clienteId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId));
        }
        if (atendenteId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("atendente").get("id"), atendenteId));
        }

        return vendaRepository.findAll(spec).stream()
                .map(VendaResponseDTO::new)
                .toList();
    }

    @Transactional
    public VendaResponseDTO cancelar(Long id) {
        Venda venda = buscarPorId(id);

        if (venda.getStatus() == StatusVenda.CANCELADA) {
            throw new RegraDeNegocioException("Essa venda já está cancelada");
        }

        var operadorLogado = OperadorAutenticado.obter();
        Operador operador = operadorLogado != null ? operadorRepository.findById(operadorLogado.id()).orElse(null) : null;

        for (ItemVenda item : venda.getItens()) {
            Produto produto = item.getProduto();
            produto.setQuantidade(produto.getQuantidade() + item.getQuantidade());
            registrarMovimentacao(produto, TipoMovimentacaoEstoque.ENTRADA, item.getQuantidade(),
                    "Estorno do cancelamento da venda #" + venda.getId(), venda.getId(), operador);
        }

        venda.setStatus(StatusVenda.CANCELADA);
        return new VendaResponseDTO(vendaRepository.save(venda));
    }

    @Transactional(readOnly = true)
    public List<Venda> listarFinalizadasEntreDatas(LocalDateTime inicio, LocalDateTime fim) {
        return vendaRepository.findAll((root, query, cb) -> cb.and(
                cb.greaterThanOrEqualTo(root.get("dataVenda"), inicio),
                cb.lessThanOrEqualTo(root.get("dataVenda"), fim),
                cb.equal(root.get("status"), StatusVenda.FINALIZADA)
        ));
    }
}

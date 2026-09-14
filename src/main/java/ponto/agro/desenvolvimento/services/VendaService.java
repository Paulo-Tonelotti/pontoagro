package ponto.agro.desenvolvimento.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ItemVendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaRequestDTO;
import ponto.agro.desenvolvimento.dto.VendaResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.ItemVenda;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.Venda;
import ponto.agro.desenvolvimento.models.enums.StatusVenda;
import ponto.agro.desenvolvimento.repositories.ProdutoRepository;
import ponto.agro.desenvolvimento.repositories.VendaRepository;

@Service
public class VendaService {
    
    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;


    public VendaService(VendaRepository vendaRepository, ProdutoRepository produtoRepository) {
        this.vendaRepository = vendaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> buscarTodos() {
        return vendaRepository.findAll()
        .stream()
        .map(VendaResponseDTO::new)
        .toList();

    }

    @Transactional(readOnly = true)
    private Venda buscarVendaPorId(Long vendaId) {
        if(vendaId == null){
            throw new RegraDeNegocioException("A categoria do produto é obrigatória");
        }

        return vendaRepository.findById(vendaId)
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada"));

    }

    @Transactional(readOnly = true)
    public VendaResponseDTO buscarPorIdDto(Long id) {
        Venda venda = buscarPorId(id);
        return new VendaResponseDTO(venda);
    }

    @Transactional(readOnly = true)
    public Venda buscarPorId(Long id){
        return vendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("O produto com ID informado não foi encontrado"));

    }

    @Transactional 
    public VendaResponseDTO salvar(VendaRequestDTO dto){
        Venda venda = new Venda();
        venda.setStatus(StatusVenda.FINALIZADA);
        
        for (ItemVendaRequestDTO item : dto.itens()) {
            Produto produto = produtoRepository.findById(item.produtoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("O produto com ID informado não foi encontrado"));

            if(produto.getQuantidade() < item.quantidade()) {
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
        
        @SuppressWarnings("null")
        BigDecimal valorTotal = venda.getItens().
                                stream().
                                map(item -> item.calcularSubtotal()).
                                reduce(BigDecimal.ZERO, BigDecimal::add);

        venda.setValorTotal(valorTotal);

        Venda vendaSalva = vendaRepository.save(venda);

        return new VendaResponseDTO(vendaSalva);
        
    }
}

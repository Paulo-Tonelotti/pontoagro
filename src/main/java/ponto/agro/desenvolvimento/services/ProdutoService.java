package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.EntradaEstoqueRequestDTO;
import ponto.agro.desenvolvimento.dto.MovimentacaoEstoqueResponseDTO;
import ponto.agro.desenvolvimento.dto.ProdutoRequestDTO;
import ponto.agro.desenvolvimento.dto.ProdutoResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.models.MovimentacaoEstoque;
import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.enums.TipoMovimentacaoEstoque;
import ponto.agro.desenvolvimento.repositories.CategoriaRepository;
import ponto.agro.desenvolvimento.repositories.MovimentacaoEstoqueRepository;
import ponto.agro.desenvolvimento.repositories.OperadorRepository;
import ponto.agro.desenvolvimento.repositories.ProdutoRepository;
import ponto.agro.desenvolvimento.security.OperadorAutenticado;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final OperadorRepository operadorRepository;

    public ProdutoService(ProdutoRepository produtoRepository,
                          CategoriaRepository categoriaRepository,
                          MovimentacaoEstoqueRepository movimentacaoEstoqueRepository,
                          OperadorRepository operadorRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.movimentacaoEstoqueRepository = movimentacaoEstoqueRepository;
        this.operadorRepository = operadorRepository;
    }


    private void preencherDadosProduto(ProdutoRequestDTO produtoDto, Produto produto, Categoria categoria) {
        produto.setNome(produtoDto.nome());
        produto.setPreco(produtoDto.preco());
        produto.setDataValidade(produtoDto.dataValidade());
        produto.setUnidadeMedida(produtoDto.unidadeMedida());
        produto.setCategoria(categoria);
    }

    private Operador buscarOperadorLogado() {
        var logado = OperadorAutenticado.obter();
        return logado != null ? operadorRepository.findById(logado.id()).orElse(null) : null;
    }

    private void registrarMovimentacao(Produto produto, TipoMovimentacaoEstoque tipo, Integer quantidade, String observacao) {
        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setObservacao(observacao);
        movimentacao.setOperador(buscarOperadorLogado());
        movimentacaoEstoqueRepository.save(movimentacao);
    }


    private Categoria buscarCategoriaPorId(Long categoriaId) {
        if(categoriaId == null){
            throw new RegraDeNegocioException("A categoria do produto é obrigatória");
        }

        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada"));

    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public ProdutoResponseDTO salvar(ProdutoRequestDTO dto){
        if(produtoRepository.existsByCodigoBarra(dto.codigoBarra())){
            throw new RegraDeNegocioException("Produto já cadastrado com esse codigo de barras");
        }

        Categoria categoria = buscarCategoriaPorId(dto.categoriaId());

        Produto produto = new Produto();
        preencherDadosProduto(dto, produto, categoria);
        produto.setCodigoBarra(dto.codigoBarra());
        produto.setQuantidade(dto.quantidade());

        Produto produtoSalvo = produtoRepository.save(produto);

        if (dto.quantidade() != null && dto.quantidade() > 0) {
            registrarMovimentacao(produtoSalvo, TipoMovimentacaoEstoque.ENTRADA, dto.quantidade(), "Estoque inicial de cadastro");
        }

        return new ProdutoResponseDTO(produtoSalvo);

    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> buscarTodos(){
        return produtoRepository.findAll()
                .stream()
                .map(ProdutoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorIdDto(Long id) {
        Produto produto = buscarPorId(id);
        return new ProdutoResponseDTO(produto);
    }

    @Transactional(readOnly = true)
    public Produto buscarPorId(Long id){
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("O produto com ID informado não foi encontrado"));

    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorCodigoBarra(String codigoBarra) {
        Produto produto = produtoRepository.findByCodigoBarra(codigoBarra)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Nenhum produto encontrado para o código de barras informado"));
        return new ProdutoResponseDTO(produto);
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public ProdutoResponseDTO atualizarProduto(Long id, ProdutoRequestDTO dto){
        Produto produtoAntigo = buscarPorId(id);

        Categoria categoria = buscarCategoriaPorId(dto.categoriaId());
        preencherDadosProduto(dto, produtoAntigo, categoria);

        Produto produtoAtualizado = produtoRepository.save(produtoAntigo);
        
        return new ProdutoResponseDTO(produtoAtualizado);
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public void deletarProduto(Long id) {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public ProdutoResponseDTO darEntradaEstoque(Long id, EntradaEstoqueRequestDTO dto) {
        Produto produto = buscarPorId(id);

        produto.setQuantidade(produto.getQuantidade() + dto.quantidade());
        Produto produtoAtualizado = produtoRepository.save(produto);

        registrarMovimentacao(produtoAtualizado, TipoMovimentacaoEstoque.ENTRADA, dto.quantidade(), dto.observacao());

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    @Transactional(readOnly = true)
    public List<MovimentacaoEstoqueResponseDTO> listarMovimentacoes(Long produtoId) {
        buscarPorId(produtoId);
        return movimentacaoEstoqueRepository.findByProdutoIdOrderByDataMovimentacaoDesc(produtoId).stream()
                .map(MovimentacaoEstoqueResponseDTO::new)
                .toList();
    }
}

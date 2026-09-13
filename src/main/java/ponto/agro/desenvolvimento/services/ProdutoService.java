package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ProdutoRequestDTO;
import ponto.agro.desenvolvimento.dto.ProdutoResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.repositories.CategoriaRepository;
import ponto.agro.desenvolvimento.repositories.ProdutoRepository;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository,
                          CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    private void preencherDadosProduto(ProdutoRequestDTO produtoDto, Produto produto, Categoria categoria) {
        produto.setNome(produtoDto.nome());
        produto.setPreco(produtoDto.preco());
        produto.setQuantidade(produtoDto.quantidade());
        produto.setDataValidade(produtoDto.dataValidade());
        produto.setUnidadeMedida(produtoDto.unidadeMedida());
        produto.setCategoria(categoria);
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



        Produto produtoSalvo = produtoRepository.save(produto);
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
}

package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public Produto salvar(Produto produto){
        if(produtoRepository.existsByCodigoBarra(produto.getCodigoBarra())){
            throw new RegraDeNegocioException("Produto já cadastrado com esse codigo de barras");
        }

        if(produto.getCategoria() == null || produto.getCategoria().getId() == null){
            throw new RegraDeNegocioException("A categoria do produto é obrigatória");
        }

        Categoria categoria = categoriaRepository.findById(produto.getCategoria().getId())
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada"));

        produto.setCategoria(categoria);
        return produtoRepository.save(produto);

    }

    @Transactional(readOnly = true)
    public List<Produto> buscarTodos(){
        return produtoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Produto buscarPorId(Long id){
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("O produto com ID informado não foi encontrado"));

    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public Produto atualizarProduto(Long id, Produto produtoAtualizado){
        Produto produtoAntigo = buscarPorId(id);

        if(produtoAtualizado.getCategoria() == null || produtoAtualizado.getCategoria().getId() == null){
            throw new RegraDeNegocioException("A categoria do produto é obrigatória");
        }

        Categoria categoria = categoriaRepository.findById(produtoAtualizado.getCategoria().getId())
                .orElseThrow(() -> new RegraDeNegocioException("Categoria não encontrada"));

        produtoAntigo.setNome(produtoAtualizado.getNome());
        produtoAntigo.setPreco(produtoAtualizado.getPreco());
        produtoAntigo.setQuantidade(produtoAtualizado.getQuantidade());
        produtoAntigo.setUnidadeMedida(produtoAtualizado.getUnidadeMedida());
        produtoAntigo.setDataValidade(produtoAtualizado.getDataValidade());
        produtoAntigo.setCategoria(categoria);

        return produtoRepository.save(produtoAntigo);
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public void deletarProduto(Long id) {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }
}

package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.models.enums.UnidadeMedida;
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
}

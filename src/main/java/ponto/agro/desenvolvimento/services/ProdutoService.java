package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.repositories.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public Produto salvar(Produto produto){
        if(produtoRepository.existsByCodigoBarra(produto.getCodigoBarra())){
            throw new RegraDeNegocioException("Produto já cadastrado com esse codigo de barras");
        }
        return produtoRepository.save(produto);

    }
}

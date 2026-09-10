package ponto.agro.desenvolvimento.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ponto.agro.desenvolvimento.models.Produto;
import ponto.agro.desenvolvimento.services.ProdutoService;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }


    @PostMapping
    public Produto salvarProduto(@RequestBody Produto produto){
        return produtoService.salvar(produto);
    }
}

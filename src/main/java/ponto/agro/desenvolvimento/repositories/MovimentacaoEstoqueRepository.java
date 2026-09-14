package ponto.agro.desenvolvimento.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.MovimentacaoEstoque;

public interface MovimentacaoEstoqueRepository extends JpaRepository<MovimentacaoEstoque, Long> {
    List<MovimentacaoEstoque> findByProdutoIdOrderByDataMovimentacaoDesc(Long produtoId);
}

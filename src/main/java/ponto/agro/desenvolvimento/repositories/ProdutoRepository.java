package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    boolean existsByCodigoBarra(String codigoBarra);
}

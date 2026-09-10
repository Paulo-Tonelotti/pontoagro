package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}

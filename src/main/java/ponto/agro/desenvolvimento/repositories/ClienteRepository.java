package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}

package ponto.agro.desenvolvimento.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.Operador;

public interface OperadorRepository extends JpaRepository<Operador, Long> {
    Optional<Operador> findByLogin(String login);
    boolean existsByLogin(String login);
}

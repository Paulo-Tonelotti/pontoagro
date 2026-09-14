package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ponto.agro.desenvolvimento.models.Configuracao;

public interface ConfiguracaoRepository extends JpaRepository<Configuracao, Long> {
}

package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ponto.agro.desenvolvimento.models.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long>, JpaSpecificationExecutor<Venda> {

}

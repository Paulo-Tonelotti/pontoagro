package ponto.agro.desenvolvimento.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ponto.agro.desenvolvimento.models.Venda;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    
}

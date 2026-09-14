package ponto.agro.desenvolvimento.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ProdutoMaisVendidoDTO;
import ponto.agro.desenvolvimento.dto.TotalPeriodoDTO;
import ponto.agro.desenvolvimento.dto.TotalPorFormaPagamentoDTO;
import ponto.agro.desenvolvimento.models.ItemVenda;
import ponto.agro.desenvolvimento.models.Venda;
import ponto.agro.desenvolvimento.models.enums.FormaPagamento;

@Service
public class RelatorioService {

    private final VendaService vendaService;

    public RelatorioService(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    private List<Venda> buscarVendasDoPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        LocalDateTime inicio = dataInicio.atStartOfDay();
        LocalDateTime fim = LocalDateTime.of(dataFim, LocalTime.MAX);
        return vendaService.listarFinalizadasEntreDatas(inicio, fim);
    }

    @Transactional(readOnly = true)
    public TotalPeriodoDTO totalPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        List<Venda> vendas = buscarVendasDoPeriodo(dataInicio, dataFim);
        BigDecimal total = vendas.stream().map(Venda::getValorTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new TotalPeriodoDTO(total, vendas.size());
    }

    @Transactional(readOnly = true)
    public List<ProdutoMaisVendidoDTO> produtosMaisVendidos(LocalDate dataInicio, LocalDate dataFim, int limite) {
        List<Venda> vendas = buscarVendasDoPeriodo(dataInicio, dataFim);

        Map<Long, AcumuladorProduto> acumulado = new LinkedHashMap<>();
        for (Venda venda : vendas) {
            for (ItemVenda item : venda.getItens()) {
                AcumuladorProduto acumuladorProduto = acumulado.computeIfAbsent(
                        item.getProduto().getId(),
                        id -> new AcumuladorProduto(item.getProduto().getNome()));
                acumuladorProduto.quantidade += item.getQuantidade();
                acumuladorProduto.valorTotal = acumuladorProduto.valorTotal.add(item.calcularSubtotal());
            }
        }

        return acumulado.entrySet().stream()
                .map(e -> new ProdutoMaisVendidoDTO(e.getKey(), e.getValue().nome, e.getValue().quantidade, e.getValue().valorTotal))
                .sorted(Comparator.comparingLong(ProdutoMaisVendidoDTO::quantidadeVendida).reversed())
                .limit(limite)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TotalPorFormaPagamentoDTO> totalPorFormaPagamento(LocalDate dataInicio, LocalDate dataFim) {
        List<Venda> vendas = buscarVendasDoPeriodo(dataInicio, dataFim);

        Map<FormaPagamento, BigDecimal> totais = new LinkedHashMap<>();
        for (Venda venda : vendas) {
            totais.merge(venda.getFormaPagamento(), venda.getValorTotal(), BigDecimal::add);
        }

        return totais.entrySet().stream()
                .map(e -> new TotalPorFormaPagamentoDTO(e.getKey(), e.getValue()))
                .toList();
    }

    private static class AcumuladorProduto {
        final String nome;
        long quantidade;
        BigDecimal valorTotal = BigDecimal.ZERO;

        AcumuladorProduto(String nome) {
            this.nome = nome;
        }
    }
}

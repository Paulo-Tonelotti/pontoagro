package ponto.agro.desenvolvimento.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ponto.agro.desenvolvimento.dto.ProdutoMaisVendidoDTO;
import ponto.agro.desenvolvimento.dto.TotalPeriodoDTO;
import ponto.agro.desenvolvimento.dto.TotalPorFormaPagamentoDTO;
import ponto.agro.desenvolvimento.services.RelatorioService;

@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    public RelatorioController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/vendas-periodo")
    public ResponseEntity<TotalPeriodoDTO> totalPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        return ResponseEntity.ok(relatorioService.totalPorPeriodo(dataInicio, dataFim));
    }

    @GetMapping("/produtos-mais-vendidos")
    public ResponseEntity<List<ProdutoMaisVendidoDTO>> produtosMaisVendidos(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(defaultValue = "10") int limite) {
        return ResponseEntity.ok(relatorioService.produtosMaisVendidos(dataInicio, dataFim, limite));
    }

    @GetMapping("/formas-pagamento")
    public ResponseEntity<List<TotalPorFormaPagamentoDTO>> totalPorFormaPagamento(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        return ResponseEntity.ok(relatorioService.totalPorFormaPagamento(dataInicio, dataFim));
    }
}

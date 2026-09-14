package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.ConfiguracaoRequestDTO;
import ponto.agro.desenvolvimento.dto.ConfiguracaoResponseDTO;
import ponto.agro.desenvolvimento.models.Configuracao;
import ponto.agro.desenvolvimento.repositories.ConfiguracaoRepository;

@Service
public class ConfiguracaoService {

    private final ConfiguracaoRepository configuracaoRepository;

    public ConfiguracaoService(ConfiguracaoRepository configuracaoRepository) {
        this.configuracaoRepository = configuracaoRepository;
    }

    @Transactional
    public ConfiguracaoResponseDTO buscar() {
        return new ConfiguracaoResponseDTO(buscarOuCriar());
    }

    private Configuracao buscarOuCriar() {
        return configuracaoRepository.findById(1L).orElseGet(() -> configuracaoRepository.save(new Configuracao()));
    }

    @Transactional
    public ConfiguracaoResponseDTO atualizar(ConfiguracaoRequestDTO dto) {
        Configuracao configuracao = buscarOuCriar();
        configuracao.setNomeComercio(dto.nomeComercio());
        configuracao.setEndereco(dto.endereco());
        configuracao.setTelefone(dto.telefone());
        configuracao.setCnpj(dto.cnpj());
        configuracao.setIe(dto.ie());
        configuracao.setUsarLeitorPadrao(dto.usarLeitorPadrao());
        return new ConfiguracaoResponseDTO(configuracaoRepository.save(configuracao));
    }
}

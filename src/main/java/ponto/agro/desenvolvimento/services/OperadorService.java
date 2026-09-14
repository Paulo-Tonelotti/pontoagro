package ponto.agro.desenvolvimento.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.OperadorRequestDTO;
import ponto.agro.desenvolvimento.dto.OperadorResponseDTO;
import ponto.agro.desenvolvimento.dto.OperadorUpdateRequestDTO;
import ponto.agro.desenvolvimento.exceptions.AcessoNegadoException;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;
import ponto.agro.desenvolvimento.repositories.OperadorRepository;
import ponto.agro.desenvolvimento.security.OperadorAutenticado;

@Service
public class OperadorService {

    private final OperadorRepository operadorRepository;
    private final PasswordEncoder passwordEncoder;

    public OperadorService(OperadorRepository operadorRepository, PasswordEncoder passwordEncoder) {
        this.operadorRepository = operadorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private void exigirGerente() {
        var logado = OperadorAutenticado.obter();
        if (logado == null || !PerfilOperador.GERENTE.name().equals(logado.perfil())) {
            throw new AcessoNegadoException("Apenas gerentes podem gerenciar usuários");
        }
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public OperadorResponseDTO cadastrar(OperadorRequestDTO dto) {
        exigirGerente();

        if (operadorRepository.existsByLogin(dto.login())) {
            throw new RegraDeNegocioException("Já existe um operador com esse login");
        }

        Operador operador = new Operador();
        operador.setNome(dto.nome());
        operador.setLogin(dto.login());
        operador.setSenha(passwordEncoder.encode(dto.senha()));
        operador.setPerfil(dto.perfil());

        return new OperadorResponseDTO(operadorRepository.save(operador));
    }

    @Transactional(readOnly = true)
    public List<OperadorResponseDTO> listar() {
        return operadorRepository.findAll().stream()
                .map(OperadorResponseDTO::new)
                .toList();
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public OperadorResponseDTO atualizar(Long id, OperadorUpdateRequestDTO dto) {
        exigirGerente();

        Operador operador = operadorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Operador não encontrado"));

        var logado = OperadorAutenticado.obter();
        if (logado != null && logado.id().equals(id) && !dto.ativo()) {
            throw new RegraDeNegocioException("Você não pode desativar o próprio usuário");
        }

        operador.setNome(dto.nome());
        operador.setPerfil(dto.perfil());
        operador.setAtivo(dto.ativo());

        return new OperadorResponseDTO(operadorRepository.save(operador));
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public void inativar(Long id) {
        exigirGerente();

        var logado = OperadorAutenticado.obter();
        if (logado != null && logado.id().equals(id)) {
            throw new RegraDeNegocioException("Você não pode desativar o próprio usuário");
        }

        Operador operador = operadorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Operador não encontrado"));
        operador.setAtivo(false);
        operadorRepository.save(operador);
    }
}

package ponto.agro.desenvolvimento.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.LoginRequestDTO;
import ponto.agro.desenvolvimento.dto.LoginResponseDTO;
import ponto.agro.desenvolvimento.exceptions.NaoAutorizadoException;
import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.repositories.OperadorRepository;
import ponto.agro.desenvolvimento.security.JwtService;

@Service
public class AuthService {

    private final OperadorRepository operadorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(OperadorRepository operadorRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.operadorRepository = operadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        Operador operador = operadorRepository.findByLogin(dto.login())
                .orElseThrow(() -> new NaoAutorizadoException("Login ou senha inválidos"));

        if (!operador.isAtivo()) {
            throw new NaoAutorizadoException("Operador inativo");
        }

        if (!passwordEncoder.matches(dto.senha(), operador.getSenha())) {
            throw new NaoAutorizadoException("Login ou senha inválidos");
        }

        String token = jwtService.gerarToken(operador.getId(), operador.getNome(), operador.getPerfil().name());
        return new LoginResponseDTO(token, operador.getId(), operador.getNome(), operador.getPerfil());
    }
}

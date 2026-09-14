package ponto.agro.desenvolvimento.security;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ponto.agro.desenvolvimento.exceptions.NaoAutorizadoException;

@Component
public class AutenticacaoInterceptor implements HandlerInterceptor {

    private final JwtService jwtService;

    public AutenticacaoInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new NaoAutorizadoException("Token de acesso não informado");
        }

        try {
            var claims = jwtService.validarToken(header.substring(7));
            Long operadorId = Long.valueOf(claims.getSubject());
            String nome = claims.get("nome", String.class);
            String perfil = claims.get("perfil", String.class);
            OperadorAutenticado.definir(new OperadorContexto(operadorId, nome, perfil));
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            throw new NaoAutorizadoException("Token de acesso inválido ou expirado");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        OperadorAutenticado.limpar();
    }
}

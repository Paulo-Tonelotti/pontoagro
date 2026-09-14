package ponto.agro.desenvolvimento.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.models.Operador;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;
import ponto.agro.desenvolvimento.repositories.CategoriaRepository;
import ponto.agro.desenvolvimento.repositories.OperadorRepository;

@Configuration
public class CargaDadosConfig {

    @Bean
    CommandLineRunner iniciarBanco(CategoriaRepository categoriaRepository, OperadorRepository operadorRepository,
                                    PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoriaRepository.count() == 0) {
                Categoria cat = new Categoria();
                cat.setNome("Rações e Nutrição");
                cat.setDescricao("Alimentos balanceados para animais");
                categoriaRepository.save(cat);
            }

            if (operadorRepository.count() == 0) {
                Operador admin = new Operador();
                admin.setNome("Administrador");
                admin.setLogin("admin");
                admin.setSenha(passwordEncoder.encode("admin123"));
                admin.setPerfil(PerfilOperador.GERENTE);
                operadorRepository.save(admin);
            }
        };
    }
}

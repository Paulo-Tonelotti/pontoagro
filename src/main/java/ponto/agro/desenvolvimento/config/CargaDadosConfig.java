package ponto.agro.desenvolvimento.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.repositories.CategoriaRepository;

@Configuration
public class CargaDadosConfig {

    @Bean
    CommandLineRunner iniciarBanco(CategoriaRepository categoriaRepository) {
        return args -> {
            if (categoriaRepository.count() == 0) {
                Categoria cat = new Categoria();
                cat.setNome("Rações e Nutrição");
                cat.setDescricao("Alimentos balanceados para animais");
                categoriaRepository.save(cat);
            }
        };
    }
}
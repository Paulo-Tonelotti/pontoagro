package ponto.agro.desenvolvimento.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ponto.agro.desenvolvimento.models.enums.PerfilOperador;

import java.util.Objects;

@Entity
@Table(name = "tb_operador")
public class Operador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "O login é obrigatório")
    @Column(nullable = false, unique = true)
    private String login;

    @NotBlank(message = "A senha é obrigatória")
    @Column(nullable = false)
    private String senha;

    @NotNull(message = "O perfil é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerfilOperador perfil;

    @Column(nullable = false)
    private boolean ativo = true;

    public Operador() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public PerfilOperador getPerfil() {
        return perfil;
    }

    public void setPerfil(PerfilOperador perfil) {
        this.perfil = perfil;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Operador operador = (Operador) o;
        return Objects.equals(id, operador.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}

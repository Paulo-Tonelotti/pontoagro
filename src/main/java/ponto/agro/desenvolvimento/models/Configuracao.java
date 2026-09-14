package ponto.agro.desenvolvimento.models;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_configuracao")
public class Configuracao {

    @Id
    private Long id = 1L;

    private String nomeComercio;

    private String endereco;

    private String telefone;

    private String cnpj;

    private String ie;

    @Column(nullable = false)
    private boolean usarLeitorPadrao = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeComercio() {
        return nomeComercio;
    }

    public void setNomeComercio(String nomeComercio) {
        this.nomeComercio = nomeComercio;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getIe() {
        return ie;
    }

    public void setIe(String ie) {
        this.ie = ie;
    }

    public boolean isUsarLeitorPadrao() {
        return usarLeitorPadrao;
    }

    public void setUsarLeitorPadrao(boolean usarLeitorPadrao) {
        this.usarLeitorPadrao = usarLeitorPadrao;
    }
}

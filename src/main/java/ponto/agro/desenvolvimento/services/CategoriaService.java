package ponto.agro.desenvolvimento.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ponto.agro.desenvolvimento.dto.CategoriaRequestDTO;
import ponto.agro.desenvolvimento.dto.CategoriaResponseDTO;
import ponto.agro.desenvolvimento.exceptions.RecursoNaoEncontradoException;
import ponto.agro.desenvolvimento.exceptions.RegraDeNegocioException;
import ponto.agro.desenvolvimento.models.Categoria;
import ponto.agro.desenvolvimento.repositories.CategoriaRepository;

import java.util.List;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    private void preencherDadosCategoria(CategoriaRequestDTO dto, Categoria categoria) {
        categoria.setNome(dto.nome());
        categoria.setDescricao(dto.descricao());
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public CategoriaResponseDTO salvar(CategoriaRequestDTO dto) {
        if (categoriaRepository.existsByNome(dto.nome())) {
            throw new RegraDeNegocioException("Categoria já cadastrada com esse nome");
        }

        Categoria categoria = new Categoria();
        preencherDadosCategoria(dto, categoria);

        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return new CategoriaResponseDTO(categoriaSalva);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> buscarTodos() {
        return categoriaRepository.findAll()
                .stream()
                .map(CategoriaResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO buscarPorIdDto(Long id) {
        Categoria categoria = buscarPorId(id);
        return new CategoriaResponseDTO(categoria);
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("A categoria com ID informado não foi encontrada"));
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public CategoriaResponseDTO atualizarCategoria(Long id, CategoriaRequestDTO dto) {
        Categoria categoriaAntiga = buscarPorId(id);

        if (!categoriaAntiga.getNome().equals(dto.nome()) && categoriaRepository.existsByNome(dto.nome())) {
            throw new RegraDeNegocioException("Categoria já cadastrada com esse nome");
        }

        preencherDadosCategoria(dto, categoriaAntiga);

        Categoria categoriaAtualizada = categoriaRepository.save(categoriaAntiga);
        return new CategoriaResponseDTO(categoriaAtualizada);
    }

    @Transactional(rollbackFor = RegraDeNegocioException.class)
    public void deletarCategoria(Long id) {
        Categoria categoria = buscarPorId(id);
        categoriaRepository.delete(categoria);
    }
}

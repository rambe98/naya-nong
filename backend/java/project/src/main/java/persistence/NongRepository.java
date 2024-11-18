package persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import entity.NongEntity;

@Repository
public interface NongRepository extends JpaRepository<NongEntity,Integer>{

}

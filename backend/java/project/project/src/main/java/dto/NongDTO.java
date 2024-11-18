package dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NongDTO {
	   private int ClientNum;
	   private String UserId;
	   private String UserPwd;
	   private String UserEmail;
	   private String UserPnum;
	   private String UserName;
	   

// Entity -> DTO 변환
public NongDTO(NongEntity entity) {
	this.ClientNum = entity.getClientNum();
	this.UserId = entity.getUserId();
	this.UserPwd = entity.getUserPwd();
	this.UserEmail = entity.getUerEmail();
	this.UserPnum = entity.getUserPnum();
	this.UserName = entity.getUserName();
	
}

//DTO -> Entity 변환
public static NongEntity toEntity(NongDTO dto) {
	
	return NongEntity.builder()
					 .clientNum(dto.getClientNum())
					 .UserId(dto.getUserId())
					 .UserPwd(dto.getUserPwd())
					 .UserEmail(dto.getUserEmail())
					 .UserPnum(dto.getClientNum())
					 .UserName(dto.getUserName())
					 .build();
}
	

}

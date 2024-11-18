package dto;

import entity.NongEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NongDTO {
	
	private int ClientNum;
	private String UserId;
	private String UserPwd;
	private String UserEmail;
	private String UserPnum;
	private String UserName;
	

	//Entity - > dto
	public NongDTO(NongEntity entity) {
		
		this.ClientNum = entity.getClientNum();
		this.UserId = entity.getUserId();
		this.UserPwd = entity.getUserPwd();
		this.UserEmail = entity.getUserEmail();
		this.UserPnum = entity.getUserPnum();
		this.UserName = entity.getUserName();
	}
	
	//dto -> Entity
	public static NongEntity toEntity(NongDTO dto) {
		
		return NongEntity.builder()
						 .ClientNum(dto.getClientNum())
						 .UserId(dto.getUserId())
						 .UserPwd(dto.getUserPwd())
						 .UserEmail(dto.getUserEmail())
						 .UserPnum(dto.getUserPnum())
						 .UserName(dto.getUserName())
						 .build();
	}
	

}












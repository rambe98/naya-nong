package com.test.project.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceDataDTO {
    private String itemname;
    private String kindname;
    private String countyname;
    private String marketname;
    private String yyyy;
    private String regday;
    private String price;
    
    
  
}

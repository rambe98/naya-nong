package com.test.project.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceRequestDTO  {
	   private String p_startday;
	    private String p_endday;
	    private String p_itemcategorycode;
	    private String p_itemcode;
	    private String p_kindcode;
	    private String p_productrankcode;
	    private String p_countrycode;
	    private String p_returntype;
}

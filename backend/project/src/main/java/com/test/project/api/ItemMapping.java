package com.test.project.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemMapping {
    private String itemCategoryCode;
    private String itemCode;
    private String kindCode;

    // 생성자, getter, setter
    public ItemMapping(String itemCategoryCode, String itemCode, String kindCode) {
        this.itemCategoryCode = itemCategoryCode;
        this.itemCode = itemCode;
        this.kindCode = kindCode;
    }
}

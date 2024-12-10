package com.test.project.api;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/searchItem")
    public ApiResponseDTO searchItem(@RequestParam("item_name") String itemName,
                                     @RequestParam("item_category_code") String itemCategoryCode) {
        return apiService.searchItem(itemName, itemCategoryCode);
    }
}
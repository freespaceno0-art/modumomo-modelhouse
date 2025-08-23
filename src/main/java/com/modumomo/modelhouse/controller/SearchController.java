package com.modumomo.modelhouse.controller;

import com.modumomo.modelhouse.entity.ModelHouse;
import com.modumomo.modelhouse.service.ModelHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/search")
public class SearchController {
    
    @Autowired
    private ModelHouseService modelHouseService;
    
    @GetMapping
    public String searchPage(@RequestParam(required = false) String q, Model model) {
        model.addAttribute("title", "Modumomo - 검색");
        
        if (q != null && !q.trim().isEmpty()) {
            List<ModelHouse> searchResults = modelHouseService.searchModelHouses(q.trim());
            model.addAttribute("searchResults", searchResults);
            model.addAttribute("searchTerm", q.trim());
            model.addAttribute("resultCount", searchResults.size());
        } else {
            model.addAttribute("searchResults", List.of());
            model.addAttribute("searchTerm", "");
            model.addAttribute("resultCount", 0);
        }
        
        return "search";
    }
    
    @GetMapping("/api")
    @ResponseBody
    public List<ModelHouse> searchApi(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return List.of();
        }
        return modelHouseService.searchModelHouses(q.trim());
    }
    
    @GetMapping("/category/{category}")
    public String searchByCategory(@PathVariable String category, Model model) {
        model.addAttribute("title", "Modumomo - " + category + " 검색");
        
        List<ModelHouse> categoryResults = modelHouseService.getModelHousesByCategory(category);
        model.addAttribute("searchResults", categoryResults);
        model.addAttribute("searchTerm", category);
        model.addAttribute("resultCount", categoryResults.size());
        model.addAttribute("isCategorySearch", true);
        
        return "search";
    }
}

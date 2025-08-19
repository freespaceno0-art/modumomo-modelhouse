package com.modumomo.modelhouse.service;

import com.modumomo.modelhouse.entity.User;
import com.modumomo.modelhouse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username 파라미터는 실제로는 email로 사용됨
        User user = userRepository.findByEmail(username).orElse(null);
        
        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }
        
        List<String> roles = new ArrayList<>();
        roles.add(user.getRole());
        
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) // email을 username으로 사용
                .password(user.getPassword())
                .roles(user.getRole().replace("ROLE_", ""))
                .build();
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public boolean isAdmin(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        try {
            User user = findByUsername(username);
            return user != null && "ROLE_ADMIN".equals(user.getRole());
        } catch (Exception e) {
            System.err.println("isAdmin 체크 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}

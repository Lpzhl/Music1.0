package com.music.uitl;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String generateToken(String username) {
        String jws = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (10*1000))) // 7 days
                .signWith(SECRET_KEY)
                .compact();
        return jws;
    }

    public static String generateRefreshToken(String username) {
        String jws = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (20*10000))) // 30 days
                .signWith(SECRET_KEY)
                .compact();
        return jws;
    }

    //验证长token
    public static boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(refreshToken);
            return true;
        } catch (ExpiredJwtException e) {
            // JWT已过期
            System.out.println("JWT1已过期: " + refreshToken);
            return false;
        } catch (JwtException e) {
            // JWT无效
            System.out.println("JWT1无效: " + refreshToken);
            return false;
        }
    }

    // 验证短token
    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            // JWT已过期
            System.out.println("JWT已过期: " + token);
            return false;
        } catch (JwtException e) {
            // JWT无效
            System.out.println("JWT无效: " + token);
            return false;
        }
    }



    public static String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}


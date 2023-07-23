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
                .setExpiration(new Date(System.currentTimeMillis() + (5000))) // 7 days
                .signWith(SECRET_KEY)
                .compact();
        return jws;
    }

    public static String generateRefreshToken(String username) {
        String jws = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (5000))) // 30 days
                .signWith(SECRET_KEY)
                .compact();
        return jws;
    }

    public static boolean validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(refreshToken);
            return true;
        } catch (ExpiredJwtException e) {
            // JWT已过期
            System.out.println("JWT已过期: " + refreshToken);
            return false;
        } catch (JwtException e) {
            // JWT无效
            System.out.println("JWT无效: " + refreshToken);
            return false;
        }
    }


    public static String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}

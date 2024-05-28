/*package com.music.Filter;

import com.music.uitl.JwtUtil;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/user/*")
public class JwtFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 其他请求需要验证token
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (JwtUtil.validateToken(token)) {
                filterChain.doFilter(servletRequest, servletResponse);
                return;
            }
        }
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Invalid or missing access token");
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化代码（如果需要的话）
    }

    @Override
    public void destroy() {
        // 清理代码（如果需要的话）
    }
}
*/

/*
        // 不拦截登录和刷新token的请求
        String path = request.getServletPath();
        System.out.println("路径是："+path);
        if (path.equals("/login.html") || path.equals("/refreshToken")||path.equals("/home.html")||path.equals("/user")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }
 */


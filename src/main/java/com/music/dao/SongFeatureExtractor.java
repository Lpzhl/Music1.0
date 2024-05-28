package com.music.dao;

// SongFeatureExtractor.java

import java.util.List;

public class SongFeatureExtractor {
    // 方法用于提取歌曲特征，这里以标签为特征示例
    public static String extractFeatures(List<String> tags) {
        StringBuilder featureBuilder = new StringBuilder();
        for (String tag : tags) {
            featureBuilder.append(tag).append(" ");
        }
        return featureBuilder.toString().trim();
    }
}

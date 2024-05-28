package com.music.uitl;

import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonDeserializationContext;

import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CustomDateDeserializer implements JsonDeserializer<Date> {
    private static final String[] DATE_PATTERNS = {
            "yyyy/M/d HH:mm:ss",
            "yyyy-MM-dd HH:mm:ss",
            // Add other patterns if needed
    };

    @Override
    public Date deserialize(JsonElement je, Type type, JsonDeserializationContext jdc) throws JsonParseException {
        for (String pattern : DATE_PATTERNS) {
            try {
                return new SimpleDateFormat(pattern).parse(je.getAsString());
            } catch (ParseException ignored) {}
        }
        throw new JsonParseException("Unparseable date: \"" + je.getAsString() + "\"");
    }
}

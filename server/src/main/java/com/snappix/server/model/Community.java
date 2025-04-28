package com.snappix.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "communities")
public class Community {

    @Id
    private String id;

    private String name;
    private String description;
    private String iconUrl;
    private String bannerUrl;
    private List<String> topics;
    private String createdBy;

    private List<String> members = new ArrayList<>();

    // Moderators field and getter/setter
    private List<String> moderators = new ArrayList<>();

    public Community() {}

    public Community(String name, String description, String iconUrl) {
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
    }

    public String getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public List<String> getMembers() { return members; }
    public void setMembers(List<String> members) { this.members = members; }

    // Moderators getter/setter
    public List<String> getModerators() { return moderators; }
    public void setModerators(List<String> moderators) { this.moderators = moderators; }

    public int getMemberCount() { return members == null ? 0 : members.size(); }

    @JsonIgnore
    public void setTopicsFromJson(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            this.topics = mapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            this.topics = List.of();
        }
    }
}

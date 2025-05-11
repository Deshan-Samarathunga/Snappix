package com.snappix.server.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OnlineUserTracker {
    // Map community name -> Set of online user IDs
    private Map<String, Set<String>> onlineUsersByComm = new ConcurrentHashMap<>();

    public Set<String> getOnlineUsers(String communityName) {
    return onlineUsersByComm.getOrDefault(communityName, 
        ConcurrentHashMap.newKeySet());
}


    public void userJoined(String communityName, String userId) {
        onlineUsersByComm.computeIfAbsent(communityName, k -> ConcurrentHashMap.newKeySet())
            .add(userId);
    }

    public void userLeft(String communityName, String userId) {
        if (onlineUsersByComm.containsKey(communityName)) {
            onlineUsersByComm.get(communityName).remove(userId);
        }
    }

    public int getOnlineCount(String communityName) {
        return onlineUsersByComm.getOrDefault(communityName, ConcurrentHashMap.newKeySet()).size();
    }
}

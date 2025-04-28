package com.snappix.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration; // ADD THIS IMPORT

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // MODIFY THIS LINE
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}

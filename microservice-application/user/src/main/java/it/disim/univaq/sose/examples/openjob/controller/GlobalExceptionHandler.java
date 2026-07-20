package it.disim.univaq.sose.examples.openjob.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		String message = "Violazione dei vincoli di integrità dei dati.";
		String msgLower = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";
		if (msgLower.contains("username") || msgLower.contains("uklgkd7iin2rkv9xkrkvdf6do2v") || msgLower.contains("duplicate entry")) {
			message = "Esiste già un utente con questo username. Scegliere uno username univoco.";
		} else if (msgLower.contains("email") || msgLower.contains("uk6j5t70rd2eub907qysjvvd76n")) {
			message = "Esiste già un utente registrato con questo indirizzo email. Scegliere un'altra email.";
		} else if (msgLower.contains("duplicate entry")) {
			message = "Esiste già un record con questi identificativi nel sistema.";
		}
		return buildResponse(HttpStatus.CONFLICT, "Conflict", message);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", "I dati inviati non sono validi o sono incompleti.");
	}

	@ExceptionHandler(java.util.NoSuchElementException.class)
	public ResponseEntity<Map<String, Object>> handleNotFound(java.util.NoSuchElementException ex) {
		return buildResponse(HttpStatus.NOT_FOUND, "Not Found", "La risorsa richiesta non è stata trovata.");
	}

	@ExceptionHandler(SecurityException.class)
	public ResponseEntity<Map<String, Object>> handleSecurityException(SecurityException ex) {
		return buildResponse(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Si è verificato un errore interno al microservizio. Riprovare o contattare l'amministratore.");
	}

	private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("timestamp", Instant.now().toString());
		body.put("status", status.value());
		body.put("error", error);
		body.put("message", message);
		return new ResponseEntity<>(body, status);
	}
}

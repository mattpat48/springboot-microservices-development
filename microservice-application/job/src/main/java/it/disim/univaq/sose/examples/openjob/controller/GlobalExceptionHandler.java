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
		if (msgLower.contains("duplicate entry") || msgLower.contains("applicant")) {
			message = "Questo candidato ha già inviato una candidatura per questa offerta di lavoro.";
		} else if (msgLower.contains("foreign key") || msgLower.contains("constraint")) {
			message = "Riferimento non valido ad un'altra risorsa del sistema.";
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
		String msg = ex.getMessage() != null ? ex.getMessage() : "La risorsa richiesta non è stata trovata.";
		return buildResponse(HttpStatus.NOT_FOUND, "Not Found", msg);
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

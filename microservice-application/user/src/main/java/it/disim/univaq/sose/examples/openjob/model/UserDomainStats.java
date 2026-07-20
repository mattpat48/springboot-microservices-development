package it.disim.univaq.sose.examples.openjob.model;

import java.io.Serializable;
import java.util.Map;

public class UserDomainStats implements Serializable {
	private static final long serialVersionUID = 1L;

	private long totalUsers;
	private long activeUsers;
	private long inactiveUsers;
	private long newUsers24h;
	private long newUsers7d;
	private Map<String, Long> roleBreakdown;

	public UserDomainStats() {}

	public UserDomainStats(long totalUsers, long activeUsers, long inactiveUsers, long newUsers24h, long newUsers7d, Map<String, Long> roleBreakdown) {
		this.totalUsers = totalUsers;
		this.activeUsers = activeUsers;
		this.inactiveUsers = inactiveUsers;
		this.newUsers24h = newUsers24h;
		this.newUsers7d = newUsers7d;
		this.roleBreakdown = roleBreakdown;
	}

	public long getTotalUsers() {
		return totalUsers;
	}

	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}

	public long getActiveUsers() {
		return activeUsers;
	}

	public void setActiveUsers(long activeUsers) {
		this.activeUsers = activeUsers;
	}

	public long getInactiveUsers() {
		return inactiveUsers;
	}

	public void setInactiveUsers(long inactiveUsers) {
		this.inactiveUsers = inactiveUsers;
	}

	public long getNewUsers24h() {
		return newUsers24h;
	}

	public void setNewUsers24h(long newUsers24h) {
		this.newUsers24h = newUsers24h;
	}

	public long getNewUsers7d() {
		return newUsers7d;
	}

	public void setNewUsers7d(long newUsers7d) {
		this.newUsers7d = newUsers7d;
	}

	public Map<String, Long> getRoleBreakdown() {
		return roleBreakdown;
	}

	public void setRoleBreakdown(Map<String, Long> roleBreakdown) {
		this.roleBreakdown = roleBreakdown;
	}
}

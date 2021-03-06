package database;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import model.Schedule;

public class SchedulesDAO {
	
	java.sql.Connection conn;
	
	public SchedulesDAO() {
		try {
			conn = DatabaseUtil.connect();
		} catch (Exception e) {
			conn = null;
		}
	}
	
	public Schedule getSchedule(String scheduleID) throws Exception{
		
		try {
			Schedule schedule = null;
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM Schedules WHERE name=?;");
			ps.setString(1, scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			while (resultSet.next()) {
				schedule = generateSchedule(resultSet);
			}
			
			resultSet.close();
			ps.close();
			
			return schedule;
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("Failed to get schedule" + e.getMessage());
		}
	}
	
	@SuppressWarnings("deprecation")
	public boolean addSchedule(Schedule schedule) throws Exception {
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM Schedules WHERE name=?;");
			ps.setString(1, schedule.scheduleID);
			ResultSet resultSet = ps.executeQuery();
			
			// check to see if schedule already exists. Is this actually needed?
			while (resultSet.next()) {
				Schedule s = generateSchedule(resultSet);
				resultSet.close();
				return false;
			}
			
			ps = conn.prepareStatement("INSERT INTO Schedules (Name, startTime, endTime, Delta, startDate, endDate, secretCode) values(?,?,?,?,?,?,?)");
			ps.setString(1, schedule.name);
			ps.setInt(2, schedule.startTime);
			ps.setInt(3, schedule.endTime);
			ps.setInt(4, schedule.slotDelta);
			
			Date sqlStartDate = new Date(schedule.startDate.getYear(), schedule.startDate.getMonth(), schedule.startDate.getDay());
			Date sqlEndDate = new Date(schedule.endDate.getYear(), schedule.endDate.getMonth(), schedule.endDate.getDay());

			ps.setDate(5, sqlStartDate);
			ps.setDate(6, sqlEndDate);
			ps.setString(7, schedule.secretCode);
			ps.execute();
			
			return true;
			
		} catch (Exception e) {
			throw new Exception("Failed to insert new schedule: " + e.getMessage());
		}
	}
	
	private Schedule generateSchedule(ResultSet resultSet) throws Exception {
		String scheduleID = resultSet.getString("ID");
		String name = resultSet.getString("Name");
		int startTime = resultSet.getInt("startTime");
		int endTime = resultSet.getInt("endTime");
		int delta = resultSet.getInt("Delta");
		Date startDate = resultSet.getDate("startDate");
		Date endDate = resultSet.getDate("endDate");
		String secretCode = resultSet.getString("secretCode");
		
		return new Schedule (scheduleID, name, startTime, endTime, delta, startDate, endDate, secretCode);
		
	}

}

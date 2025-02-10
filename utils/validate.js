


const validateEventDateTime = {
    
    isValidDateFormat: (dateString) => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    },
  
    
    isStartBeforeEnd: (startDateTime, endDateTime) => {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      return start < end;
    },
  
    
    isInPast: (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      return date < now;
    },
  
 
    isReasonableDuration: (startDateTime, endDateTime, maxHours = 24) => {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const durationHours = (end - start) / (1000 * 60 * 60);
      return durationHours <= maxHours && durationHours > 0;
    },
  
 
    validateEventTimes: (startDateTime, endDateTime) => {
      
      
        const maxDurationHours = 24;
  
      const errors = [];
  
      
      if (!startDateTime || !endDateTime) {
        errors.push('Both start and end date/time are required');
        return { isValid: false, errors };
      }
  
      
      if (!validateEventDateTime.isValidDateFormat(startDateTime)) {
        errors.push('Invalid start date/time format');
      }
      if (!validateEventDateTime.isValidDateFormat(endDateTime)) {
        errors.push('Invalid end date/time format');
      }
  
      
      if (errors.length > 0) {
        return { isValid: false, errors };
      }
  
      
      if (!validateEventDateTime.isStartBeforeEnd(startDateTime, endDateTime)) {
        errors.push('Start date/time must be before end date/time');
      }
  
      
      if (validateEventDateTime.isInPast(startDateTime)) {
        errors.push('Event cannot be scheduled in the past');
      }
  
      
      if (!validateEventDateTime.isReasonableDuration(startDateTime, endDateTime, maxDurationHours)) {
        errors.push(`Event duration cannot exceed ${maxDurationHours} hours`);
      }
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };
  
 module.exports = validateEventDateTime
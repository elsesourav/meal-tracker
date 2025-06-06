## Testing the Clear Data Fix

### Test Steps:

1. **Open the app and add some meal data**

   -  Go to the main meal tracker page
   -  Select some values for different dates
   -  Verify the data is saved (check statistics in Settings)

2. **Test the Clear Data functionality**

   -  Go to Settings page
   -  First, use "Check Current Data" debug button to see what exists
   -  Then use "Clear All Data" button
   -  Verify the success message appears

3. **Verify data is actually cleared**
   -  Check statistics in Settings (should show all zeros)
   -  Use "Check Current Data" debug button again (should show no data)
   -  Go back to main page - all dropdowns should be reset to defaults
   -  Close and reopen the app
   -  Verify data is still cleared (this was the original issue)

### Expected Results:

-  ✅ Statistics show 0 values
-  ✅ Debug check shows no meal data or custom data
-  ✅ Main page shows default values (all "--" and "OFF")
-  ✅ After closing/reopening app, data remains cleared

### What was fixed:

The original issue was that clearing data only cleared AsyncStorage but left the in-memory state intact. The auto-save mechanism would then re-save the in-memory data when the app went to background or when navigating.

Now the `clearAllData` function clears BOTH AsyncStorage AND in-memory state, preventing auto-save from restoring the data.

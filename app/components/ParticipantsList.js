"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Alert,
  CircularProgress,
  Fade,
  useTheme,
} from "@mui/material";
import { Download, Group, ErrorOutline } from "@mui/icons-material";

const ParticipantList = () => {
  const theme = useTheme();
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const [eventOptions, setEventOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "https://sxv-backend.onrender.com/api/events/getEvents"
        );
        setEventOptions(data.events);
      } catch (err) {
        setError("Failed to load events. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleInputChange = (event) => {
    setEventName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://sxv-backend.onrender.com/api/events/getEv",
        {
          eventId: eventName,
        }
      );
      setParticipants(response.data);
      setError("");
    } catch (err) {
      setError("Error retrieving participants. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setIsDownloading(true);
    try {
      const filteredParticipants = participants.map((participant) => ({
        Name: participant.username,
        Email: participant.email,
        College: participant.college,
        "Graduation Year": participant.graduationYear,
        Branch: participant.branch,
        Phone: participant.phone,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(filteredParticipants);
      XLSX.utils.book_append_sheet(wb, ws, "Participants");
      XLSX.writeFile(wb, "participants.xlsx");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "black", py: 4 }}>
      <Container maxWidth="lg">
        <Fade in timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <Typography
              sx={{
                color: "#C0000A",
                fontFamily: "BentonSans Comp Black",
                fontSize: "1.7rem",
                display: "flex",
                fontWeight: "bold",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              SAMAVESH X VASSAUNT
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: { xs: "stretch", md: "flex-end" },
                justifyContent: "center",
              }}
            >
              <FormControl sx={{ minWidth: 230, height: 45 ,fontFamily: "BentonSans Comp Black",}}>
                <InputLabel sx={{fontFamily: "BentonSans Comp Black",}}>Select Event</InputLabel>
                <Select sx={{fontFamily: "BentonSans Comp Black"}}
                  value={eventName}
                  onChange={handleInputChange}
                  label="Select Event"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Select an event</em>
                  </MenuItem>
                  {eventOptions.map((event) => (
                    <MenuItem key={event._id} value={event._id}>
                      {event.eventName} (Day {event.day})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                type="submit"
                disabled={!eventName || loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="success" />
                  ) : (
                    <Group />
                  )
                }
                sx={{ minWidth: 200 , fontFamily: "BentonSans Comp Black",}}
              >
                Get Participants
              </Button>

              {participants.length > 0 && (
                <Button
                  variant="outlined"
                  onClick={downloadExcel}
                  disabled={isDownloading}
                  startIcon={
                    isDownloading ? (
                      <CircularProgress size={20} color="green" />
                    ) : (
                      <Download />
                    )
                  }
                  sx={{ minWidth: 200 , fontFamily: "BentonSans Comp Black"}}
                >
                  Download Excel
                </Button>
              )}
            </Box>

            {error && (
              <Alert
                severity="error"
                icon={<ErrorOutline />}
                sx={{ width: "100%" }}
              >
                {error}
              </Alert>
            )}

            <Fade in={participants.length > 0 || loading} timeout={500}>
              <TableContainer component={Paper} elevation={1}>
                {participants.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>College</TableCell>
                        <TableCell>Year</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {participants.map((participant) => (
                        <TableRow
                          key={participant._id}
                          sx={{
                            "&:hover": {
                              bgcolor: "action.hover",
                              transition: "background-color 0.2s",
                              fontFamily: "BentonSans Comp Black"
                            },
                          }}
                        >
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.username}</TableCell>
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.email}</TableCell>
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.college}</TableCell>
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.graduationYear}</TableCell>
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.branch}</TableCell>
                          <TableCell sx={{fontFamily: "BentonSans Comp Black"}}>{participant.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Typography color="text.secondary">
                        Select an event to view participants
                      </Typography>
                    )}
                  </Box>
                )}
              </TableContainer>
            </Fade>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ParticipantList;

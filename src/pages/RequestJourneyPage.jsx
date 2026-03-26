// src/pages/RequestJourneyPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import API from "../api/api";

const STATUS_STYLES = {
  APPROVED: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
  PENDING: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  REJECTED: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
};

export default function RequestJourneyPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let requestData = null;
    let stagesData = [];

    setLoading(true);

    API.get(`/user/requests`)
      .then((res) => {
        const found = res.data.find(
          (item) => String(item.id) === String(id)
        );

        if (!found) throw new Error("Request not found");

        requestData = found;

        return API.get(`/workflow/${id}`);
      })
      .then((stageRes) => {
        stagesData = stageRes.data || [];
      })
      .catch((err) => {
        console.error("API ERROR:", err);
      })
      .finally(() => {
        if (!requestData) {
          setRequest(null);
          setLoading(false);
          return;
        }

        const currentStage = requestData.stageNumber || 1;

        // 🔥 Ensure both stages always
        let finalStages = [...stagesData];

        if (finalStages.length === 1) {
          finalStages.push({
            id: 999,
            stageOrder: 2,
            stageName: "Admin Approval",
            approverRole: "ADMIN",
          });
        }

        if (finalStages.length === 0) {
          finalStages = [
            {
              id: 1,
              stageOrder: 1,
              stageName: "Manager Approval",
              approverRole: "MANAGER",
            },
            {
              id: 2,
              stageOrder: 2,
              stageName: "Admin Approval",
              approverRole: "ADMIN",
            },
          ];
        }

        const sortedStages = finalStages.sort(
          (a, b) => a.stageOrder - b.stageOrder
        );

        const timeline = sortedStages.map((stage) => {
          let status = "PENDING";

          if (stage.stageOrder < currentStage) {
            status = "APPROVED";
          } else if (stage.stageOrder === currentStage) {
            status = requestData.status;
          }

          return {
            id: stage.id,
            stage: stage.stageName,
            status,
            actor: requestData.assignedTo || stage.approverRole,
            role: stage.approverRole,
            comment:
              stage.stageOrder === currentStage
                ? requestData.approvalComment || "In progress"
                : stage.stageOrder < currentStage
                ? "Approved"
                : "Waiting for approval",
            time: stage.createdAt || requestData.slaDeadline,
          };
        });

        setRequest({
          id: requestData.id,
          title: requestData.title,
          type: requestData.requestType,
          priority: requestData.urgency,
          timeline,
        });

        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout showSearch={false}>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout showSearch={false}>
        <Typography>No Request Found</Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout showSearch={false}>
      <Stack spacing={3}>
        {/* 🔥 Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#fff",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={800}>
              {request.title}
            </Typography>

            <Typography color="text.secondary">
              {request.id} | {request.type} | {request.priority} Urgency
            </Typography>
          </Stack>
        </Paper>

        {/* 🔥 Timeline */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#fff",
          }}
        >
          <Stack spacing={3}>
            {request.timeline.map((item, index) => {
              const style =
                STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;

              return (
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                >
                  {/* 🔥 Timeline Dot */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: style.bg,
                      border: `2px solid ${style.color}`,
                      display: "grid",
                      placeItems: "center",
                      mt: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: style.color,
                      }}
                    />
                  </Box>

                  {/* 🔥 Content */}
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography fontWeight={700}>
                        Stage {index + 1}: {item.stage}
                      </Typography>

                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor: style.bg,
                          color: style.color,
                        }}
                      />
                    </Stack>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #e5e7eb",
                        mt: 1.5,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar>
                          {item.actor?.charAt(0) || "U"}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700}>
                            {item.actor}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {item.role}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Comment */}
                      <Typography mt={2}>
                        {item.comment}
                      </Typography>

                      {/* Time */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={1}
                      >
                        {item.time
                          ? new Date(item.time).toLocaleString()
                          : "No time"}
                      </Typography>
                    </Paper>

                    {index !== request.timeline.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Paper>

        {/* 🔥 Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained">Approve</Button>
        </Stack>
      </Stack>
    </DashboardLayout>
  );
}
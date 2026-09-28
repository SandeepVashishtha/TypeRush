"use client";

import { useEffect, useRef } from "react";
import { RACE_STATUS } from "@/lib/game/constants";

export default function GameCanvas({
  playerDistance = 0,
  playerSpeed = 0,
  playerWpm = 0,
  isNitroActive = false,
  aiDistance = 0,
  aiSpeed = 0,
  aiConfig = { carColor: "#a855f7", carName: "Viper GT" },
  raceStatus = RACE_STATUS.IDLE,
  totalRaceDistance = 100,
}) {
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const stateRef = useRef({
    playerDistance,
    playerSpeed,
    playerWpm,
    isNitroActive,
    aiDistance,
    aiSpeed,
    aiConfig,
    raceStatus,
    roadOffset: 0,
    particles: [],
    speedLines: [],
    nitroPuffs: [],
    screenShake: 0,
    lastTime: performance.now(),
  });

  useEffect(() => {
    if (isNitroActive && !stateRef.current.isNitroActive) {
      stateRef.current.screenShake = 6;
    }
    stateRef.current.playerDistance = playerDistance;
    stateRef.current.playerSpeed = playerSpeed;
    stateRef.current.playerWpm = playerWpm;
    stateRef.current.isNitroActive = isNitroActive;
    stateRef.current.aiDistance = aiDistance;
    stateRef.current.aiSpeed = aiSpeed;
    stateRef.current.aiConfig = aiConfig;
    stateRef.current.raceStatus = raceStatus;
  }, [playerDistance, playerSpeed, playerWpm, isNitroActive, aiDistance, aiSpeed, aiConfig, raceStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 800;
    let height = 280;

    const handleResize = () => {
      if (!canvas) return;
      const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 800;
      const parentHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 280;
      const dpr = window.devicePixelRatio || 1;
      
      width = Math.max(320, parentWidth || 800);
      height = Math.min(360, Math.max(240, parentHeight || 280));
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    stateRef.current.speedLines = [];
    for (let i = 0; i < 35; i++) {
      stateRef.current.speedLines.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 25 + Math.random() * 60,
        speed: 9 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.4,
      });
    }

    const drawSafeRoundRect = (context, x, y, w, h, r) => {
      context.beginPath();
      if (typeof context.roundRect === "function") {
        context.roundRect(x, y, w, h, r);
      } else {
        context.rect(x, y, w, h);
      }
      context.closePath();
    };

    const drawSkyline = (c, w, h, roadOffset) => {
      const skyGrad = c.createLinearGradient(0, 0, 0, h * 0.45);
      skyGrad.addColorStop(0, "#05070d");
      skyGrad.addColorStop(1, "#0f172a");
      c.fillStyle = skyGrad;
      c.fillRect(0, 0, w, h * 0.45);

      c.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 24; i++) {
        const sx = ((i * 73 + roadOffset * 0.05) % w + w) % w;
        const sy = (i * 29) % (h * 0.35);
        c.fillRect(sx, sy, 1.5, 1.5);
      }

      const bldgOffset = (roadOffset * 0.15) % 120;
      c.fillStyle = "#0c1322";
      for (let x = -bldgOffset - 100; x < w + 100; x += 55) {
        const bHeight = 35 + ((Math.abs(x) * 17) % 50);
        c.fillRect(x, h * 0.45 - bHeight, 48, bHeight);

        if (x % 2 === 0) {
          c.fillStyle = "rgba(0, 240, 255, 0.25)";
          c.fillRect(x + 10, h * 0.45 - bHeight + 10, 5, 6);
          c.fillRect(x + 26, h * 0.45 - bHeight + 22, 5, 6);
          c.fillStyle = "#0c1322";
        }
      }

      c.strokeStyle = "rgba(0, 240, 255, 0.4)";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, h * 0.45);
      c.lineTo(w, h * 0.45);
      c.stroke();
    };

    const drawRoad = (c, w, h, roadOffset) => {
      const roadTop = h * 0.45;
      const roadHeight = h - roadTop;

      const roadGrad = c.createLinearGradient(0, roadTop, 0, h);
      roadGrad.addColorStop(0, "#111827");
      roadGrad.addColorStop(0.5, "#0b0f19");
      roadGrad.addColorStop(1, "#030712");
      c.fillStyle = roadGrad;
      c.fillRect(0, roadTop, w, roadHeight);

      const curbSegment = 40;
      const curbOffset = (roadOffset * 1.5) % curbSegment;
      for (let x = -curbOffset - curbSegment; x < w + curbSegment; x += curbSegment) {
        const isRed = Math.floor((x + curbOffset) / curbSegment) % 2 === 0;
        c.fillStyle = isRed ? "#ff0055" : "#ffffff";
        c.fillRect(x, roadTop - 4, curbSegment, 5);
        c.fillRect(x, h - 5, curbSegment, 5);
      }

      const laneY = roadTop + roadHeight * 0.5;
      const dashLength = 35;
      const dashGap = 25;
      const totalDash = dashLength + dashGap;
      const dashOffset = (roadOffset * 1.8) % totalDash;

      c.strokeStyle = "rgba(0, 240, 255, 0.7)";
      c.lineWidth = 3;
      c.setLineDash([dashLength, dashGap]);
      c.lineDashOffset = -dashOffset;

      c.beginPath();
      c.moveTo(0, laneY);
      c.lineTo(w, laneY);
      c.stroke();
      c.setLineDash([]);

      const playerProgress = stateRef.current.playerDistance / totalRaceDistance;
      if (playerProgress >= 0.85) {
        const finishX = w * 0.78 + (1 - playerProgress) * w * 1.2;
        if (finishX < w + 50 && finishX > -50) {
          const checkSize = 10;
          for (let y = roadTop; y < h; y += checkSize) {
            for (let ch = 0; ch < 3; ch++) {
              const isWhite = (Math.floor(y / checkSize) + ch) % 2 === 0;
              c.fillStyle = isWhite ? "#ffffff" : "#000000";
              c.fillRect(finishX + ch * checkSize, y, checkSize, checkSize);
            }
          }

          c.fillStyle = "#ffe600";
          c.shadowColor = "#ffe600";
          c.shadowBlur = 10;
          c.font = "bold 13px sans-serif";
          c.fillText("FINISH", finishX - 6, roadTop - 10);
          c.shadowBlur = 0;
        }
      }
    };

    const drawCar = (c, x, y, color, isPlayer, isNitro, speedRatio) => {
      c.save();
      c.translate(x, y);

      const carLength = 76;
      const carWidth = 34;
      const halfL = carLength / 2;
      const halfW = carWidth / 2;

      const vibX = (Math.random() - 0.5) * (speedRatio * 1.6);
      const vibY = (Math.random() - 0.5) * (speedRatio * 1.6);
      c.translate(vibX, vibY);

      c.shadowColor = isNitro ? "#00f0ff" : color;
      c.shadowBlur = isNitro ? 24 : 14;
      c.fillStyle = isNitro ? "rgba(0, 240, 255, 0.45)" : `${color}44`;
      c.beginPath();
      c.ellipse(0, 0, halfL * 0.85, halfW * 0.75, 0, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;

      c.fillStyle = "#0a0f1d";
      c.fillRect(-halfL + 6, -halfW - 3, 16, 6);
      c.fillRect(halfL - 22, -halfW - 3, 16, 6);
      c.fillRect(-halfL + 6, halfW - 3, 16, 6);
      c.fillRect(halfL - 22, halfW - 3, 16, 6);

      c.fillStyle = isNitro ? "#00f0ff" : color;
      c.fillRect(-halfL + 12, -halfW - 3, 4, 6);
      c.fillRect(halfL - 16, -halfW - 3, 4, 6);
      c.fillRect(-halfL + 12, halfW - 3, 4, 6);
      c.fillRect(halfL - 16, halfW - 3, 4, 6);

      const bodyGrad = c.createLinearGradient(-halfL, 0, halfL, 0);
      bodyGrad.addColorStop(0, "#1e293b");
      bodyGrad.addColorStop(0.3, color);
      bodyGrad.addColorStop(0.7, color);
      bodyGrad.addColorStop(1, "#0f172a");

      c.fillStyle = bodyGrad;
      c.beginPath();
      c.moveTo(halfL - 4, -halfW + 6);
      c.lineTo(halfL + 2, 0);
      c.lineTo(halfL - 4, halfW - 6);
      c.lineTo(halfL - 14, halfW);
      c.lineTo(-halfL + 8, halfW);
      c.lineTo(-halfL, halfW - 4);
      c.lineTo(-halfL, -halfW + 4);
      c.lineTo(-halfL + 8, -halfW);
      c.lineTo(halfL - 14, -halfW);
      c.closePath();
      c.fill();

      c.strokeStyle = "rgba(255, 255, 255, 0.4)";
      c.lineWidth = 1.2;
      c.stroke();

      const glassGrad = c.createLinearGradient(-15, 0, 15, 0);
      glassGrad.addColorStop(0, "#080c14");
      glassGrad.addColorStop(0.6, isPlayer ? "rgba(0, 240, 255, 0.55)" : "rgba(168, 85, 247, 0.55)");
      glassGrad.addColorStop(1, "#0f172a");
      c.fillStyle = glassGrad;
      drawSafeRoundRect(c, -12, -halfW + 7, 26, carWidth - 14, 4);
      c.fill();

      c.fillStyle = "#0f172a";
      c.fillRect(-halfL - 3, -halfW + 3, 6, carWidth - 6);
      c.fillStyle = color;
      c.fillRect(-halfL - 4, -halfW + 1, 3, carWidth - 2);

      c.fillStyle = "#ffe600";
      c.shadowColor = "#ffe600";
      c.shadowBlur = 8;
      c.fillRect(halfL - 5, -halfW + 6, 4, 5);
      c.fillRect(halfL - 5, halfW - 11, 4, 5);

      const beamGrad = c.createLinearGradient(halfL, 0, halfL + 60, 0);
      beamGrad.addColorStop(0, "rgba(255, 230, 0, 0.25)");
      beamGrad.addColorStop(1, "rgba(255, 230, 0, 0)");
      c.fillStyle = beamGrad;
      c.beginPath();
      c.moveTo(halfL, -halfW + 6);
      c.lineTo(halfL + 60, -halfW - 8);
      c.lineTo(halfL + 60, halfW + 8);
      c.lineTo(halfL, halfW - 6);
      c.closePath();
      c.fill();
      c.shadowBlur = 0;

      c.fillStyle = "#ff0055";
      c.shadowColor = "#ff0055";
      c.shadowBlur = 10;
      c.fillRect(-halfL - 1, -halfW + 5, 3, 5);
      c.fillRect(-halfL - 1, halfW - 10, 3, 5);
      c.shadowBlur = 0;

      if (isNitro) {
        c.fillStyle = "#00f0ff";
        c.shadowColor = "#00f0ff";
        c.shadowBlur = 18;
        c.beginPath();
        c.moveTo(-halfL - 2, -6);
        c.lineTo(-halfL - 26 - Math.random() * 18, 0);
        c.lineTo(-halfL - 2, 6);
        c.closePath();
        c.fill();

        c.fillStyle = "#ffffff";
        c.beginPath();
        c.moveTo(-halfL - 2, -3);
        c.lineTo(-halfL - 15 - Math.random() * 10, 0);
        c.lineTo(-halfL - 2, 3);
        c.closePath();
        c.fill();
        c.shadowBlur = 0;
      }

      c.restore();
    };

    const drawEffects = (c, w, h, playerSpeedRatio, isNitro) => {
      if (playerSpeedRatio > 0.08) {
        c.strokeStyle = isNitro ? "rgba(0, 240, 255, 0.65)" : "rgba(255, 255, 255, 0.28)";
        c.lineWidth = isNitro ? 2.2 : 1;
        stateRef.current.speedLines.forEach((line) => {
          line.x -= line.speed * (1 + playerSpeedRatio * 2.2) * (isNitro ? 1.8 : 1);
          if (line.x < -line.length) {
            line.x = w + Math.random() * 100;
            line.y = Math.random() * h;
          }
          c.beginPath();
          c.moveTo(line.x, line.y);
          c.lineTo(line.x + line.length, line.y);
          c.stroke();
        });
      }

      if (isNitro && Math.random() < 0.65) {
        stateRef.current.nitroPuffs.push({
          x: w * 0.32 - 40,
          y: h * 0.74 + (Math.random() - 0.5) * 12,
          radius: 5 + Math.random() * 9,
          alpha: 0.85,
          vx: -5 - Math.random() * 6,
          color: Math.random() > 0.5 ? "#00f0ff" : "#ff0055",
        });
      }

      for (let i = stateRef.current.nitroPuffs.length - 1; i >= 0; i--) {
        const p = stateRef.current.nitroPuffs[i];
        p.x += p.vx;
        p.radius += 0.45;
        p.alpha -= 0.04;

        if (p.alpha <= 0) {
          stateRef.current.nitroPuffs.splice(i, 1);
          continue;
        }

        c.fillStyle = p.color;
        c.globalAlpha = p.alpha;
        c.beginPath();
        c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        c.fill();
        c.globalAlpha = 1.0;
      }
    };

    const renderLoop = (time) => {
      try {
        const state = stateRef.current;
        state.lastTime = time;

        ctx.save();

        if (state.screenShake > 0) {
          const shakeX = (Math.random() - 0.5) * state.screenShake;
          const shakeY = (Math.random() - 0.5) * state.screenShake;
          ctx.translate(shakeX, shakeY);
          state.screenShake *= 0.9;
          if (state.screenShake < 0.2) state.screenShake = 0;
        }

        ctx.clearRect(0, 0, width, height);

        const speedNorm = Math.max(0, Math.min(1, state.playerSpeed / 120));
        const effectiveScrollSpeed =
          state.raceStatus === RACE_STATUS.RACING
            ? Math.max(3, state.playerSpeed * 0.18) * (state.isNitroActive ? 1.6 : 1)
            : state.raceStatus === RACE_STATUS.COUNTDOWN
            ? 1.5
            : 0;

        state.roadOffset += effectiveScrollSpeed;

        drawSkyline(ctx, width, height, state.roadOffset);
        drawRoad(ctx, width, height, state.roadOffset);

        const roadTop = height * 0.45;
        const roadHeight = height - roadTop;
        const aiLaneY = roadTop + roadHeight * 0.28;
        const playerLaneY = roadTop + roadHeight * 0.74;

        const distDiff = state.playerDistance - state.aiDistance;
        const playerX = width * 0.32;
        const aiX = Math.max(50, Math.min(width - 80, playerX - distDiff * 8));

        drawCar(
          ctx,
          aiX,
          aiLaneY,
          state.aiConfig.carColor || "#a855f7",
          false,
          false,
          Math.max(0, Math.min(1, state.aiSpeed / 120))
        );

        drawCar(
          ctx,
          playerX,
          playerLaneY,
          "#ff0055",
          true,
          state.isNitroActive,
          speedNorm
        );

        drawEffects(ctx, width, height, speedNorm, state.isNitroActive);

        ctx.restore();
      } catch (err) {
        console.error("Canvas render error:", err);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [totalRaceDistance]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-arcade-border shadow-2xl bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-64 md:h-72 block bg-slate-950"
      />
      <div className="absolute top-3 left-4 flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm text-xs font-bold text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-arcade-neonPink animate-ping" />
        <span>PLAYER: <strong className="text-arcade-neonPink">YOU</strong></span>
        <span className="text-slate-500 mx-1">|</span>
        <span className="w-2 h-2 rounded-full bg-arcade-neonPurple" />
        <span>RIVAL: <strong className="text-arcade-neonPurple">{aiConfig.carName || "CPU"}</strong></span>
      </div>
    </div>
  );
}

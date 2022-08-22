import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { trace, Tracer } from "@opentelemetry/api";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'

export default function initializeTracing(serviceName: string): Tracer {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });

    const jaegerExporter = new JaegerExporter({
        endpoint: "http://localhost:14268/api/traces",
    });

    provider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));

    registerInstrumentations({
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
            new PrismaInstrumentation()
        ],
        tracerProvider: provider,
    });

    provider.register();

    return trace.getTracer(serviceName);
};
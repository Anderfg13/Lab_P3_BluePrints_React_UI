error id: file:///D:/ander/Documents/SEMESTRE%207/ARSW/LAB05%20-%20P2%20BLUEPRINTS/Lab_P2_BluePrints_Java21_API_Security_JWT/src/main/java/co/edu/eci/blueprints/api/BlueprintsAPIController.java
file:///D:/ander/Documents/SEMESTRE%207/ARSW/LAB05%20-%20P2%20BLUEPRINTS/Lab_P2_BluePrints_Java21_API_Security_JWT/src/main/java/co/edu/eci/blueprints/api/BlueprintsAPIController.java
### com.thoughtworks.qdox.parser.ParseException: syntax error @[1,1]

error in qdox parser
file content:
```java
offset: 1
uri: file:///D:/ander/Documents/SEMESTRE%207/ARSW/LAB05%20-%20P2%20BLUEPRINTS/Lab_P2_BluePrints_Java21_API_Security_JWT/src/main/java/co/edu/eci/blueprints/api/BlueprintsAPIController.java
text:
```scala
f@@delepackage co.edu.eci.blueprints.api;

import co.edu.eci.blueprints.model.Blueprint;
import co.edu.eci.blueprints.model.Point;
import co.edu.eci.blueprints.dto.BlueprintDTO;
import co.edu.eci.blueprints.dto.PointDTO;
import co.edu.eci.blueprints.dto.BlueprintMapper;
import co.edu.eci.blueprints.persistence.BlueprintNotFoundException;
import co.edu.eci.blueprints.persistence.BlueprintPersistenceException;
import co.edu.eci.blueprints.services.BlueprintsServices;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.Map;
import java.util.Set;
import co.edu.eci.blueprints.api.ApiResponse;

/**
 * REST controller for managing blueprint resources.
 * Exposes HTTP endpoints for retrieving, creating, and updating blueprints.
 * Delegates business logic to the BlueprintsServices class.
 */
@RestController
@RequestMapping("/api/v1/blueprints")
public class BlueprintsAPIController {

    /**
     * Service layer for blueprint operations.
     */
    private final BlueprintsServices services;

    /**
     * Constructs the controller with the required service dependency.
     * @param services The BlueprintsServices instance
     */
    public BlueprintsAPIController(BlueprintsServices services) { this.services = services; }

    /**
     * Retrieves all blueprints in the system.
     * @return HTTP 200 with the set of all blueprints
     */
    @Operation(summary = "Obtener todos los blueprints")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de blueprints obtenida exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "No se encontraron blueprints",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":404,\"message\":\"No se encontraron blueprints\",\"data\":null}"
                )
            )
        )
    })
    @GetMapping
    public ResponseEntity<ApiResponse<Set<BlueprintDTO>>> getAll() {
        Set<Blueprint> data = services.getAllBlueprints();
        Set<BlueprintDTO> dtoSet = data.stream().map(BlueprintMapper::toDTO).collect(java.util.stream.Collectors.toSet());
        return ResponseEntity.ok(new ApiResponse<>(200, "Success", dtoSet)); // 200 OK
    }

    /**
     * Retrieves all blueprints created by a specific author.
     * @param author The author's name
     * @return HTTP 200 with the set of blueprints, or 404 if none found
     */
    @Operation(summary = "Obtener todos los blueprints de un autor")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de blueprints del autor obtenida exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "No se encontraron blueprints para el autor",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":404,\"message\":\"No se encontraron blueprints para el autor\",\"data\":null}"
                )
            )
        )
    })
    @GetMapping("/{author}")
    public ResponseEntity<ApiResponse<Set<BlueprintDTO>>> byAuthor(@PathVariable String author) {
        try {
            Set<Blueprint> data = services.getBlueprintsByAuthor(author);
            Set<BlueprintDTO> dtoSet = data.stream().map(BlueprintMapper::toDTO).collect(java.util.stream.Collectors.toSet());
            return ResponseEntity.ok(new ApiResponse<>(200, "Success", dtoSet)); // 200 OK
        } catch (BlueprintNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, e.getMessage(), null)); // 404 Not Found
        }
    }

    /**
     * Retrieves a specific blueprint by author and blueprint name.
     * @param author The author's name
     * @param bpname The blueprint's name
     * @return HTTP 200 with the blueprint, or 404 if not found
     */
    @Operation(summary = "Obtener un blueprint por autor y nombre")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Blueprint obtenido exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Blueprint no encontrado",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":404,\"message\":\"Blueprint no encontrado\",\"data\":null}"
                )
            )
        )
    })
    @GetMapping("/{author}/{bpname}")
    public ResponseEntity<ApiResponse<BlueprintDTO>> byAuthorAndName(@PathVariable String author, @PathVariable String bpname) {
        try {
            Blueprint data = services.getBlueprint(author, bpname);
            BlueprintDTO dto = BlueprintMapper.toDTO(data);
            return ResponseEntity.ok(new ApiResponse<>(200, "Success", dto)); // 200 OK
        } catch (BlueprintNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, e.getMessage(), null)); // 404 Not Found
        }
    }

    /**
     * Creates a new blueprint with the provided data.
     * @param req The request body containing author, name, and points
     * @return HTTP 201 if created, or 403 if a blueprint with the same key already exists
     */
    @Operation(summary = "Agregar un nuevo blueprint")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Blueprint creado exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Solicitud inválida o datos incorrectos",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":400,\"message\":\"Solicitud inválida o datos incorrectos\",\"data\":null}"
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "El blueprint ya existe",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":409,\"message\":\"El blueprint ya existe\",\"data\":null}"
                )
            )
        )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> add(@Valid @RequestBody NewBlueprintRequest req) {
        try {
            // Convertir los PointDTO a Point
            java.util.List<Point> points = req.points().stream().map(BlueprintMapper::toEntity).toList();
            Blueprint bp = new Blueprint(req.author(), req.name(), points);
            services.addNewBlueprint(bp);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Created", null)); // 201 Created
        } catch (BlueprintPersistenceException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(400, e.getMessage(), null)); // 400 Bad Request
        }
    }

    /**
     * Adds a new point to an existing blueprint.
     * @param author The author's name
     * @param bpname The blueprint's name
     * @param p The point to add
     * @return HTTP 202 if accepted, or 404 if the blueprint is not found
     */
    @Operation(summary = "Agregar un punto a un blueprint existente")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "202", description = "Punto agregado exitosamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Blueprint no encontrado",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":404,\"message\":\"Blueprint no encontrado\",\"data\":null}"
                )
            )
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Solicitud inválida o datos incorrectos",
            content = @io.swagger.v3.oas.annotations.media.Content(
                mediaType = "application/json",
                examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                    value = "{\"code\":400,\"message\":\"Solicitud inválida o datos incorrectos\",\"data\":null}"
                )
            )
        )
    })
    @PutMapping("/{author}/{bpname}/points")
    public ResponseEntity<ApiResponse<Void>> addPoint(@PathVariable String author, @PathVariable String bpname,
                                      @RequestBody PointDTO p) {
        try {
            services.addPoint(author, bpname, p.getX(), p.getY());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(201, "Created", null)); // 201 Created
        } catch (BlueprintNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, e.getMessage(), null)); // 404 Not Found
        }
    }

    /**
     * Request body model for creating a new blueprint.
     * Encapsulates and validates the required fields: author, name, and points.
     */
        public record NewBlueprintRequest(
            @NotBlank String author,
            @NotBlank String name,
            @Valid java.util.List<PointDTO> points
        ) { }
}

```

```



#### Error stacktrace:

```
com.thoughtworks.qdox.parser.impl.Parser.yyerror(Parser.java:2025)
	com.thoughtworks.qdox.parser.impl.Parser.yyparse(Parser.java:2147)
	com.thoughtworks.qdox.parser.impl.Parser.parse(Parser.java:2006)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:232)
	com.thoughtworks.qdox.library.SourceLibrary.parse(SourceLibrary.java:190)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:94)
	com.thoughtworks.qdox.library.SourceLibrary.addSource(SourceLibrary.java:89)
	com.thoughtworks.qdox.library.SortedClassLibraryBuilder.addSource(SortedClassLibraryBuilder.java:162)
	com.thoughtworks.qdox.JavaProjectBuilder.addSource(JavaProjectBuilder.java:174)
	scala.meta.internal.mtags.JavaMtags.indexRoot(JavaMtags.scala:49)
	scala.meta.internal.metals.SemanticdbDefinition$.foreachWithReturnMtags(SemanticdbDefinition.scala:99)
	scala.meta.internal.metals.Indexer.indexSourceFile(Indexer.scala:560)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3(Indexer.scala:691)
	scala.meta.internal.metals.Indexer.$anonfun$reindexWorkspaceSources$3$adapted(Indexer.scala:688)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterator.foreach(Iterator.scala:1313)
	scala.meta.internal.metals.Indexer.reindexWorkspaceSources(Indexer.scala:688)
	scala.meta.internal.metals.MetalsLspService.$anonfun$onChange$2(MetalsLspService.scala:936)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.concurrent.Future$.$anonfun$apply$1(Future.scala:691)
	scala.concurrent.impl.Promise$Transformation.run(Promise.scala:500)
	java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1144)
	java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:642)
	java.base/java.lang.Thread.run(Thread.java:1583)
```
#### Short summary: 

QDox parse error in file:///D:/ander/Documents/SEMESTRE%207/ARSW/LAB05%20-%20P2%20BLUEPRINTS/Lab_P2_BluePrints_Java21_API_Security_JWT/src/main/java/co/edu/eci/blueprints/api/BlueprintsAPIController.java